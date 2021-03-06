import Component from './component';

export default class WidgetCollectionContainerComponent extends Component {
    constructor(id, parent, nodeType = 'div', widgetCollectionCompList = []) {
        super(id, parent, nodeType);
        this.widgetCollectionCompList = widgetCollectionCompList;
    }

    _buildTemplate() {
        this.widgetCollectionCompList.map(widgetCollection => {
            this.appendChild(widgetCollection);
        });
    }

    delegateActionToCollections(type, action = () => {}) {
        this.widgetCollectionCompList.map(WidgetCollection => {
            WidgetCollection.addEventListener(type, action);
        });
    }

    addWidgetCollection(widgetCollection) {
        this.widgetCollectionCompList.push(widgetCollection);
    }

    setActive() {}

    disable() {}
}
