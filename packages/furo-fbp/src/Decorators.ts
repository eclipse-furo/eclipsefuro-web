
export function hookTopic(topic: string, before:boolean=false ) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if(!target.decoratorStore){
      target.decoratorStore = []
    }
    target.decoratorStore.push({topic, handler:descriptor.value, propertyKey, before})
  };
}
