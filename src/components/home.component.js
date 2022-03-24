import React, { Component } from "react";
import ReviewListComponent from "./review-list-component";
import ReviewService from "../services/review.service";
import { TagCloud } from 'react-tagcloud'
import TagService from "../services/tag.service";
import randomColor from 'randomcolor';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            reviews: [],
            topTags: []
        };
    }
    componentDidMount() {
        TagService.getTopTags().then(
            response => {
                let responseMap = new Map(Object.entries(response.data));
                responseMap.forEach((k,v) => {
                    this.state.topTags.push({ value: v, count: k })
                })
            })
        ReviewService.getAllReviews().then(
            response => {
                this.setState({
                    reviews: response.data
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    message: resMessage
                });
            }
        );
    }
    render() {
        const data = this.state.topTags;
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content}</h3>
                </header>
                {data? (<div className="container"><h4>Top tags:</h4>
                <TagCloud
                    minSize={12}
                    maxSize={35}
                    tags={data}
                    style={{
                        fontFamily: 'sans-serif',
                        //fontSize: () => Math.round(Math.random() * 50) + 16,
                        color: () => randomColor({
                            hue: 'blue'
                        }),
                        padding: 5,
                    }}
                    className="simple-cloud"
                    onClick={tag => this.props.history.push(`/review/tag/${tag.value}`)}
                />
                        </div>) : (<span/>)}
                <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
            </div>
        );
    }
}
