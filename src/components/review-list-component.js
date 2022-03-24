import React, {Component} from "react";
import {Link} from "react-router-dom";
import Moment from "moment";
import MarkdownPreview from '@uiw/react-markdown-preview';
import '../styles.css'

export default class ReviewListComponent extends Component {
    constructor(props) {
        super(props);
        this.sortByScore = this.sortByScore.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.state = {
            message: "",
            reviews: [],
            userScoreDesc: false,
            releaseDateDesc: false,
            sortedByDate: false,
            sortedByScore: false
        };
    }

    componentDidMount() {
        this.setState({
            reviews: this.props.reviews
        })
    }

    sortByScore() {
        this.setState({
            reviews: this.state.reviews.sort((a, b) => {
                return this.state.userScoreDesc ? a.userScore - b.userScore : b.userScore - a.userScore
            }),
            userScoreDesc: !this.state.userScoreDesc,
            sortedByDate: false,
            sortedByScore: true
        })
    }

    sortByDate() {
        this.setState({
            reviews: this.state.reviews.sort((a, b) => {
                return this.state.releaseDateDesc ? new Date(a.releaseDate) - new Date(b.releaseDate)
                    : new Date(b.releaseDate) - new Date(a.releaseDate)
            }),
            releaseDateDesc: !this.state.releaseDateDesc,
            sortedByDate: true,
            sortedByScore: false
        })
    }


    render() {
        return (
            <div className="container">
                {this.state.reviews.length !== 0 && (
                    <div>
                        <div>
                            Sort by:
                            <a href="#" className="link-dark m-lg-2" onClick={this.sortByDate}>
                                {this.state.sortedByDate && (this.state.releaseDateDesc ?
                                        (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-sort-down m-lg-1" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                            </svg>
                                        ) :
                                        (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-sort-up-alt m-lg-1" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                            </svg>
                                        )
                                )
                                }
                                Date
                            </a>
                            <a href="#" className="link-dark" onClick={this.sortByScore}>
                                {this.state.sortedByScore && (this.state.userScoreDesc ?
                                        (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-sort-down m-lg-1" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                            </svg>
                                        ) :
                                        (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-sort-up-alt m-lg-1" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                            </svg>
                                        )
                                )
                                }
                                User score
                            </a>
                        </div>
                        <div>
                            {
                                this.state.reviews.map((review, review_index) =>
                                        <div key={review_index} className="card">
                                            <div className="card-body">
                                                Posted by:
                                                <Link
                                                    to={`/profile/${review.authorName}`}
                                                    style={{textDecoration: 'none'}}
                                                    className="link-dark font-weight-bold m-sm-2"
                                                >
                                                    {review.authorImgUrl ? (
                                                            <img src="{review.authorImgUrl}" alt="" width="16"
                                                                 height="16"/>)
                                                        :
                                                        (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                 height="16" fill="currentColor"
                                                                 className="bi bi-person-circle"
                                                                 viewBox="0 0 16 16">
                                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                                <path
                                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                                            </svg>
                                                        )
                                                    }
                                                    {review.authorName}
                                                </Link>
                                                {review.releaseDate && (<span
                                                    className="m-sm-2">{Moment(review.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}</span>)}
                                                <span className="m-sm-2">
                                                        Category:{" "}
                                                    {review.category}
                                                    </span>
                                                <span className="m-sm-2">
                                                        Author score: {" "} {review.authorScore / 20} {" "}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" className="bi bi-star-fill"
                                                         viewBox="0 0 16 16">
                                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                    </svg>
                                                </span>
                                                <span className="m-sm-2">
                                                        User score: {" "} {review.userScore / 20} {" "}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" className="bi bi-star-fill"
                                                         viewBox="0 0 16 16">
                                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <Link
                                                    to={`/review/details/${review.id}`}
                                                    style={{textDecoration: 'none'}}
                                                    className="link-dark"
                                                >
                                                    <h4 className="card-title">{review.title}</h4>
                                                </Link>
                                                <MarkdownPreview
                                                    source={review.full_text.split("\n")[0]}
                                                />
                                            </div>

                                            {
                                                review.imageUrls && <div className="card-body">
                                                    <div id={"carouselExampleIndicators"+ review.id} className="carousel slide" data-bs-ride="carousel">
                                                        <div className="carousel-indicators">
                                                            {review.imageUrls.map((image, index) =>
                                                                (index === 0 && <button key={index} type="button"
                                                                                        data-bs-target={"carouselExampleIndicators"+ review.id}
                                                                                        data-bs-slide-to={index}
                                                                                        className="active" aria-current="true"
                                                                                        aria-label={"Slide " + index + 1}/>)
                                                                ||
                                                                (<button key={index} type="button"
                                                                         data-bs-target={"carouselExampleIndicators"+ review.id}
                                                                         data-bs-slide-to={index}
                                                                         aria-label={"Slide " + index + 1}/>)
                                                            )}
                                                        </div>

                                                        <div className="carousel-inner">
                                                            {review.imageUrls.map((image, index) =>
                                                                (index === 0 && <div key={index} className="carousel-item active">
                                                                    <img src={image} className="" alt="..."/>
                                                                </div>)
                                                                ||
                                                                (<div key={index} className="carousel-item">
                                                                    <img src={image} className="" alt="..."/>
                                                                </div>)
                                                            )}
                                                        </div>
                                                        <button className="carousel-control-prev" type="button"
                                                                data-bs-target={"#carouselExampleIndicators" + review.id} data-bs-slide="prev">
                                                            <span className="carousel-control-prev-icon bg-secondary rounded" aria-hidden="true"/>
                                                            <span className="visually-hidden">Previous</span>
                                                        </button>
                                                        <button className="carousel-control-next" type="button"
                                                                data-bs-target={"#carouselExampleIndicators" + review.id} data-bs-slide="next">
                                                            <span className="carousel-control-next-icon bg-secondary rounded" aria-hidden="true"/>
                                                            <span className="visually-hidden">Next</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }

                                            {review.tags && <div className="card-body">
                                                <span className="">Tags:</span>
                                                {
                                                    review.tags.map((tag, tag_index) =>
                                                        <Link
                                                            className="m-sm-2"
                                                            key={tag_index}
                                                            to={`/review/tag/${tag}`}
                                                        >
                                                            {tag}
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                            }
                                        </div>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
