/* eslint-disable max-classes-per-file -- every case declares its own throwaway element classes */
import { LitElement } from "lit";
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { afterEach, describe, expect, it } from "vitest";

import { ModelBindings } from "../../src/decorators/ModelDecorators";
import { ModelContainer } from "../../src/decorators/ModelContainer";
import { ServiceBindings } from "../../src/decorators/ServiceDecorators";
import type { EntityServiceEventMap } from "../../src/decorators/EntityServiceTypes";
import { Defaults, type IDefaults } from "../protoc-gen-open-models/furo/type/Defaults";

let tagCount = 0;
/** A tag no other test has registered. */
function nextTag(): string {
  tagCount += 1;
  return `decorators-test-${String(tagCount)}`;
}

/** Registers a class under a fresh tag and connects an instance, so every test gets its own element. */
function mount(ctor: CustomElementConstructor): HTMLElement {
  const tag = nextTag();
  customElements.define(tag, ctor);
  const el = document.createElement(tag);
  document.body.appendChild(el);
  return el;
}

describe("ModelBindings", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("binds a property to a field path", () => {
    const model = new Defaults();
    const m = ModelBindings<IDefaults>(model);

    class El extends LitElement {
      @m.bind("id")
      id2: string | undefined;
    }

    const el = mount(El) as El;
    expect(el.id2).to.eql(model.id.value);
    model.id.value = "changed";
    expect(el.id2).to.eql("changed");
  });

  it("applies a base class's @bind to a subclass instance", () => {
    const model = new Defaults();
    const m = ModelBindings<IDefaults>(model);

    class Base extends LitElement {
      @m.bind("id")
      id2: string | undefined;
    }
    class Sub extends Base {}

    const el = mount(Sub) as Sub;
    model.id.value = "from-base";
    expect(el.id2).to.eql("from-base");
  });

  it("does not call a subclass's @onEvent on a base instance", () => {
    const model = new Defaults();
    const m = ModelBindings<IDefaults>(model);

    class Base extends LitElement {
      calls: string[] = [];

      @m.onEvent("field-value-changed")
      onBase() {
        this.calls.push("base");
      }
    }
    class Sub extends Base {
      @m.onEvent("field-value-changed")
      onSub() {
        this.calls.push("sub");
      }
    }
    // registered so Sub's decorator has run before the base instance connects
    customElements.define(nextTag(), Sub);

    const el = mount(Base) as Base;
    model.id.value = "x";
    expect(el.calls).not.to.include("sub");
    expect(el.calls).to.include("base");
  });

  it("listens on the field itself for a single-segment onFieldEvent path", () => {
    const model = new Defaults();
    const m = ModelBindings<IDefaults>(model);

    class El extends LitElement {
      fired = 0;

      @m.onFieldEvent("id", "this-field-value-changed")
      onId() {
        this.fired += 1;
      }
    }

    const el = mount(El) as El;
    model.id.value = "y";
    expect(el.fired).to.be.greaterThan(0);
  });

  it("rejects a path the literal does not have", () => {
    const m = ModelBindings<IDefaults>(new Defaults());
    // @ts-expect-error - not a field of IDefaults
    m.bind("noSuchField");
    m.bind("decRange.start");
    m.bind("__isValid");
  });
});

describe("ModelContainer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hands out decorators bound to its model, typed from toLiteral()", () => {
    class DefaultsContainer extends ModelContainer<Defaults> {
      constructor() {
        super(new Defaults());
      }
    }
    const container = new DefaultsContainer();

    class El extends LitElement {
      @container.decorators.bind("id")
      id2: string | undefined;
    }

    const el = mount(El) as El;
    container.model.id.value = "contained";
    expect(el.id2).to.eql("contained");

    // @ts-expect-error - paths complete from IDefaults, inferred from Defaults.toLiteral()
    container.decorators.bind("noSuchField");
  });
});

describe("ServiceBindings", () => {
  interface TestEventMap extends EntityServiceEventMap {
    "count-changed": { count: number };
    "renamed-changed": { count: number };
  }

  it("accepts a one-argument bindToEvent only when the detail carries the inferred key", () => {
    const s = ServiceBindings<TestEventMap>(new EventTarget());
    s.bindToEvent("count-changed");
    s.bindToEvent("renamed-changed", "count");
    // @ts-expect-error - detail of renamed-changed has no `renamed` key
    s.bindToEvent("renamed-changed");
    // @ts-expect-error - not an X-changed event, the key must be named
    s.bindToEvent("response-received");
  });

  describe("inheritance", () => {
    afterEach(() => {
      document.body.innerHTML = "";
    });

    const emit = (service: EventTarget, count: number) => {
      service.dispatchEvent(new CustomEvent("count-changed", { detail: { count } }));
    };

    it("applies a base class's @bindToEvent to a subclass instance", () => {
      const service = new EventTarget();
      const s = ServiceBindings<TestEventMap>(service);

      class Base extends LitElement {
        @s.bindToEvent("count-changed")
        count = 0;
      }
      class Sub extends Base {}

      const el = mount(Sub) as Sub;
      emit(service, 3);
      expect(el.count).to.eql(3);
    });

    it("keeps both a base's and a subclass's @bindToEvent", () => {
      const service = new EventTarget();
      const s = ServiceBindings<TestEventMap>(service);

      class Base extends LitElement {
        @s.bindToEvent("count-changed")
        count = 0;
      }
      class Sub extends Base {
        @s.bindToEvent("renamed-changed", "count")
        renamed = 0;
      }

      const el = mount(Sub) as Sub;
      emit(service, 4);
      service.dispatchEvent(new CustomEvent("renamed-changed", { detail: { count: 5 } }));
      expect(el.count).to.eql(4);
      expect(el.renamed).to.eql(5);
    });

    it("does not call a subclass's @onEvent on a base instance", () => {
      const service = new EventTarget();
      const s = ServiceBindings<TestEventMap>(service);

      class Base extends LitElement {
        calls: string[] = [];

        @s.onEvent("count-changed")
        onBase() {
          this.calls.push("base");
        }
      }
      class Sub extends Base {
        @s.onEvent("count-changed")
        onSub() {
          this.calls.push("sub");
        }
      }
      const base = mount(Base) as Base;
      const sub = mount(Sub) as Sub;
      emit(service, 1);
      expect(base.calls).to.eql(["base"]);
      expect(sub.calls.sort()).to.eql(["base", "sub"]);
    });

    it("binds a method a subclass redeclares once, to the subclass's version", () => {
      const service = new EventTarget();
      const s = ServiceBindings<TestEventMap>(service);

      class Base extends LitElement {
        calls: string[] = [];

        @s.onEvent("count-changed")
        onCount() {
          this.calls.push("base");
        }
      }
      class Sub extends Base {
        @s.onEvent("count-changed")
        override onCount() {
          this.calls.push("sub");
        }
      }

      const el = mount(Sub) as Sub;
      emit(service, 1);
      expect(el.calls).to.eql(["sub"]);
    });
  });
});
