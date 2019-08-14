{
  "name": "PersonCollection",
  "type": "person_collection",
  "mime": "application/person_collection+json",
  "description": "Collection with persons inside",
  "fields": {
    "meta": {
      "description": "Meta for the response",
      "type": "furo.meta",
      "__proto": {
        "number": 2
      }
    },
    "links": {
      "description": "Hateoas links",
      "type": "furo.link",
      "meta": {
        "repeated": true
      },
      "__proto": {
        "number": 3
      }
    },
    "entities": {
      "description": "person entities",
      "type": "person",
      "meta": {
        "repeated": true
      },
      "__proto": {
        "number": 4
      }
    }
  }
}