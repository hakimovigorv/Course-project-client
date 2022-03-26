import React, { Component } from "react";
import ReviewListComponent from "./review-list-component";
import ReviewService from "../services/review.service";
import { TagCloud } from 'react-tagcloud'
import TagService from "../services/tag.service";


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const options = {
            luminosity: 'bright',
            hue: 'random',
            alpha: 1
        }
        return (
            <div className="container">
                {data? (
                    <div className="container d-flex justify-content-center">
                <TagCloud
                    minSize={16}
                    maxSize={40}
                    tags={data}
                    shuffle = {false}
                    colorOptions={options}
                    className="simple-cloud"
                    onClick={tag => this.props.history.push(`/review/tag/${tag.value}`)}
                />
                        </div>) : (<span/>)}
                <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
            </div>
        );
    }
}
