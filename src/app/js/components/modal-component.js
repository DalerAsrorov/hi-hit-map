import Component from './component';
import { isEmpty } from 'ramda';

const MODAL_BASE_CLASS = 'modal fade';
const MODAL_HEADER_HTML = '<div class="modal-header"></div>'
const MODAL_CONTENT_HTML = '<div class="modal-content"></div>';
const MODAL_FOOTER_HTML = '<div class="modal-footer"></div>';
const MODAL_CLOSE_BUTTON_HTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>';
const MODAL_CLOSE_ICON = '&times;';

export default class ModalComponent extends Component {
    constructor(id, parent, nodeType, content, modelContent=null) {
        super(id, parent, nodeType, content);
        this.$modalContent = modelContent ? modelContent : MODAL_CONTENT_HTML;
    }

    buildHeader(title, handleOnCloseCallback=()=>{}) {
        let $modalHeaderWrapper = $(MODAL_HEADER_HTML);
        let $header = $('<h3 class="modal-title"></h3>');
        let $closeButton = $(`
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">${MODAL_CLOSE_ICON}</span>
            </button>
        `);

        $closeButton.click(handleOnCloseCallback);

        $header.append(`<span>${title}</span>`);
        $modalHeaderWrapper.append($header);
        $modalHeaderWrapper.append($closeButton);
        this.$modalContent.append($modalHeaderWrapper);

        return $modalHeaderWrapper;
    }

    buildBody(html='') {
        let resultContent = html;
        let $modalBody = $('<div class="modal-body"></div>');

        $modalBody.append(resultContent);
        this.$modalContent.append($modalBody);

        return $modalBody;
    }

    buildFooter(customButtons=[], closeButtonText='Close') {
        const $closeButton = $(MODAL_CLOSE_BUTTON_HTML);
        $closeButton.append(closeButtonText);


        customButtons.map((button) => {

        });
    }

    _buildTemplate() {
        this.html().addClass(MODAL_BASE_CLASS);
        let $modalDialog = $('<div class="modal-dialog" role="document"></div>');

        this.$modalContent = $(this.$modalContent);
        $modalDialog.append(this.$modalContent);

        this.html().append($modalDialog);
    }

    buildCustomTemplate() {
        const customTemplateCreated = false;

        return customTemplateCreated;
    }
}
