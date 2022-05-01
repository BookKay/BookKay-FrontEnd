export default function handleDOMMapping() {
  const HTML2DOM = (element, json) => {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === 'string') {
      if (window.DOMParser) {
        var parser = new DOMParser();
        var docNode = parser.parseFromString(element, 'text/xml');
      } else {
        // Microsoft strikes again
        var docNode = new ActiveXObject('Microsoft.XMLDOM');
        docNode.async = false;
        docNode.loadXML(element);
      }
      element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
      object['type'] = element.nodeName;
      var nodeList = element.childNodes;
      if (nodeList != null) {
        if (nodeList.length) {
          object['contents'] = [];
          for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeType == 3) {
              object['contents'].push(nodeList[i].nodeValue);
            } else {
              object['contents'].push({});
              treeHTML(
                nodeList[i],
                object['contents'][object['contents'].length - 1]
              );
            }
          }
        }
      }
      if (element.attributes != null) {
        if (element.attributes.length) {
          object['attributes'] = {};
          for (var i = 0; i < element.attributes.length; i++) {
            object['attributes'][element.attributes[i].nodeName] =
              element.attributes[i].nodeValue;
          }
        }
      }
    }
    treeHTML(element, treeObject);

    return json ? JSON.stringify(treeObject) : treeObject;
  };

  return { HTML2DOM };
}
