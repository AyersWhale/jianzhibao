
import { Component } from 'react';

export default class PageComponent extends Component {
    constructor(props) {
        super(props);
    }
    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }
}