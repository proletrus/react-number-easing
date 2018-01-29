var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');

var eases = require('eases');

var NumberEasing = React.createClass({
    displayName: 'NumberEasing',


    propTypes: {
        value: React.PropTypes.any.isRequired,
        speed: React.PropTypes.number,
        ease: React.PropTypes.oneOf(Object.keys(eases)),
        useLocaleString: React.PropTypes.bool,
        delayValue: React.PropTypes.number
    },

    timeout: null,
    startAnimationTime: null,

    getInitialState() {
        var value = parseInt(this.props.value, 10);

        return {
            previousValue: value,
            displayValue: value
        };
    },

    getDefaultProps() {
        return {
            speed: 500,
            ease: 'quintInOut',
            useLocaleString: false
        };
    },

    componentWillReceiveProps(nextProps) {
        var value = parseInt(this.props.value, 10);

        if (parseInt(nextProps.value, 10) === value) return;

        this.setState({
            previousValue: this.state.displayValue
        });

        if (!isNaN(parseInt(this.props.delayValue, 10))) {
            this.delayTimeout = setTimeout(() => {
                this.startAnimationTime = new Date().getTime();
                this.updateNumber();
            }, this.props.delayValue);
        } else {
            this.startAnimationTime = new Date().getTime();
            this.updateNumber();
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.displayValue !== this.state.displayValue;
    },

    updateNumber() {
        var value = parseInt(this.props.value, 10);

        var now = new Date().getTime();
        var elapsedTime = Math.min(this.props.speed, now - this.startAnimationTime);
        var progress = eases[this.props.ease](elapsedTime / this.props.speed);

        var currentDisplayValue = Math.round((value - this.state.previousValue) * progress + this.state.previousValue);

        this.setState({
            displayValue: currentDisplayValue
        });

        if (elapsedTime < this.props.speed) {
            this.timeout = setTimeout(this.updateNumber, 16);
        } else {
            this.setState({
                previousValue: value
            });
        }
    },

    componentWillUnmount() {
        clearTimeout(this.timeout);
        clearTimeout(this.delayTimeout);
    },

    render() {
        var _props = this.props,
            { className, useLocaleString, value, speed, ease, delayValue } = _props,
            other = _objectWithoutProperties(_props, ['className', 'useLocaleString', 'value', 'speed', 'ease', 'delayValue']);
        var { displayValue } = this.state;

        var classes = 'react-number-easing';
        if (className) classes += ' ' + className;

        return React.createElement(
            'span',
            _extends({}, other, { className: classes }),
            useLocaleString ? displayValue.toLocaleString() : displayValue
        );
    }

});

module.exports = NumberEasing;
