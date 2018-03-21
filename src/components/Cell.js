import React from 'react';

export default class Cell extends React.Component {


    getValue(){
        if (!this.props.value.isRevealed){
            return this.props.value.isFlagged ? "🚩" : null;
        }
        if (this.props.value.isMine) {
            return "💣";
        }
        if(this.props.value.neighbour === 0 ){
            return null;
        }
        return this.props.value.neighbour;
    }

    render(){
        let className = "cell" + (this.props.value.isRevealed ? "" : " hidden") + (this.props.value.isMine ? " is-mine" : "") + (this.props.value.isFlagged ? " is-flag" : "");


        return (
            <div ref="cell" onClick={this.props.onClick} className={className} onContextMenu={this.props.cMenu}>
                {this.getValue()}
            </div>
        );
    }
}
