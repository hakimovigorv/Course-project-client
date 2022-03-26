import React, {Component} from "react";
import ReviewService from "../services/review.service";
import MarkdownPreview from '@uiw/react-markdown-preview';
import RatingService from "../services/rating.service";
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import ratingService from "../services/rating.service";
import Moment from 'moment';
import ReviewCommentsComponent from "./review-comments-component";

export default class ReviewComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRating = this.handleRating.bind(this);

        this.state = {
            id: this.props.match.params.id,
            currentUser: AuthService.getCurrentUser(),
            review: null,
            message: "",
            rating: 0,
            like: null,
            likeCount: 0
        };
    }

    componentDidMount() {
        if (AuthService.getCurrentUser()) {
            RatingService.getUserRating(AuthService.getCurrentUser().id, this.state.id).then(
                response => {
                    this.setState({
                        rating: response.data
                    });
                })
            RatingService.getUserLike(AuthService.getCurrentUser().id, this.state.id).then(
                response => {
                    this.setState({
                        like: response.data
                    });
                })
        }
        ReviewService.getReview(this.state.id).then(
            response => {
                this.setState({
                    review: response.data,
                    likeCount: response.data.likeCount
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

    handleRating(rate) {
        this.setState({
            rating: rate
        });
        ratingService.rateReviewSubject(AuthService.getCurrentUser().id, this.state.id, rate)
    }

    handleLike() {
        RatingService.likeReview(AuthService.getCurrentUser().id, this.state.id).then(
            r => this.setState({
                message: r.data,
                like: !this.state.like,
                likeCount: this.state.like ? this.state.likeCount - 1 : this.state.likeCount + 1
            }))
    }

    handleDelete() {
        ReviewService.deleteReview(this.state.id).then(
            r => {
                this.setState({
                    message: r.data
                })
                this.props.history.push("/home");
                window.location.reload();
            })

    }


    render() {
        const review = this.state.review;
        const currentUser = this.state.currentUser;
        const username = currentUser ? currentUser.username : null;
        return (
            <div>
                {review && (
                    <div className="container">
                        <div className="card border border-light rounded shadow bg-light">
                            <div className="card-body d-flex justify-content-between">
                                <span>
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
                                <span className="m-sm-2 text-center">
                                                        Author score: {" "} {review.authorScore / 20} {" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-star-fill mb-1" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                                </span>
                                <span className="m-sm-2">
                                                        User score: {" "} {(review.userScore / 20).toFixed(2)} {" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-star-fill mb-1" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                                </span>
                                    </span>
                                {(username === review.authorName || this.props.isAdmin) && (
                                    <span>
                                        <Link
                                            to={`/review/edit/${this.props.match.params.id}`}
                                            className="btn btn-primary btn-block"
                                        >
                                            Edit review {" "}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                            </svg>

                                        </Link>
                                        <button
                                            className="btn btn-danger btn-block"
                                            onClick={this.handleDelete}
                                        >
                                            Delete review {" "}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                                            </svg>
                                        </button>
                                        </span>
                                )}
                            </div>
                            <div className="card-body">
                                <Link
                                    to={`/review/details/${this.props.match.params.id}`}
                                    style={{textDecoration: 'none'}}
                                    className="link-dark"
                                >
                                    <h4 className="card-title">{review.title}</h4>
                                </Link>
                                <MarkdownPreview
                                    source={review.full_text}
                                />
                            </div>
                            {
                                review.imageUrls.length !== 0 && <div className="card-body">
                                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-indicators">
                                            {review.imageUrls.map((image, index) =>
                                                (index === 0 && <button key={index} type="button"
                                                                        data-bs-target="#carouselExampleIndicators"
                                                                        data-bs-slide-to={index}
                                                                        className="active" aria-current="true"
                                                                        aria-label={"Slide " + index + 1}/>)
                                                ||
                                                (<button key={index} type="button"
                                                         data-bs-target="#carouselExampleIndicators"
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
                                        <button className="carousel-control-prev " type="button"
                                                data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon bg-secondary rounded"
                                                  aria-hidden="true"/>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button"
                                                data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                            <span className="carousel-control-next-icon bg-secondary rounded"
                                                  aria-hidden="true"/>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                            }

                            {review.tags.length !== 0 && <div className="card-body">
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

                            <div className="card-body d-flex justify-content-between">
                                <span className="fs-5">
                                    {this.state.currentUser!==null && <span>
                                    Your Scores: {" "}
                                    <Rating
                                        onClick={this.handleRating}
                                        ratingValue={this.state.rating}
                                        fillColor="black"
                                        fullIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-star-fill  mb-2"
                                                       viewBox="0 0 16 16">
                                            <path
                                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>}
                                        emptyIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-star  mb-2" viewBox="0 0 16 16">
                                            <path
                                                d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                        </svg>}
                                    />
                                    </span>}
                                    <p className="">
                                    General user Score: {" "}
                                        <Rating
                                            readonly={true}
                                            ratingValue={review.userScore}
                                            fillColor="black"
                                            fullIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                           fill="currentColor" className="bi bi-star-fill mb-2"
                                                           viewBox="0 0 16 16">
                                                <path
                                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>}
                                            emptyIcon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-star mb-2" viewBox="0 0 16 16">
                                                    <path
                                                        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                                </svg>}
                                        />
                                        </p>
                                </span>
                                <span>
                                    {this.state.likeCount} users liked this review!
                                    {
                                        this.state.currentUser!==null ? (
                                                this.state.like ? (
                                                        <button className="btn btn-dark-outline" name="block"
                                                                data-bs-toggle="tooltip"
                                                                title="Dislike"
                                                                onClick={this.handleLike}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                 fill="currentColor" className="bi bi-heart-fill  mb-2"
                                                                 viewBox="0 0 16 16">
                                                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                                            </svg>
                                                        </button>
                                                    )
                                                    :
                                                    (
                                                        <button className="btn btn-dark-outline" name="block"
                                                                data-bs-toggle="tooltip"
                                                                title="Like"
                                                                onClick={this.handleLike}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                 fill="currentColor" className="bi bi-heart  mb-2 "
                                                                 viewBox="0 0 16 16">
                                                                <path
                                                                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                                            </svg>
                                                        </button>
                                                    )
                                        )
                                            :
                                            (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-heart-fill  ms-2 mb-1"
                                                     viewBox="0 0 16 16">
                                                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                                </svg>
                                            )
                                    }
                                    {

                                    }
                                </span>
                            </div>
                        </div>
                        <div>
                            <h3>Comments:</h3>
                            <ReviewCommentsComponent reviewId={this.props.match.params.id}/>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
