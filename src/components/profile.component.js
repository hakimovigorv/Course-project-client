import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import {Link} from "react-router-dom";
import ReviewService from "../services/review.service";
import ReviewListComponent from "./review-list-component";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            profileUsername: this.props.match.params.name,
            profile: null,
            reviews: [],
            message: ""
        };
    }

    componentDidMount() {
        UserService.getProfile(this.state.profileUsername).then(
            response => {
                this.setState({
                    profile: response.data
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
        ReviewService.getReviewsByUser(this.state.profileUsername).then(
            response => {
                this.setState({
                    reviews: response.data
                })
            }
        )
    }

    render() {
        return (
            <div className="container">
                {this.state.profile !== null ? (
                        <div className="container">
                            <h3>
                                {this.state.profile.authorImgUrl ? (
                                        <img src={this.state.profile.authorImgUrl} alt="" width="20"
                                             height="20" className=""/>)
                                    :
                                    (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                             height="20" fill="currentColor"
                                             className="bi bi-person-circle"
                                             viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path
                                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                    )
                                }
                                {this.state.profile.username}
                            </h3>
                            <h5 className="">
                                {"Rating: " + this.state.profile.rating}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                </svg>
                            </h5>
                        </div>
                    )
                    : (
                    <div className="alert alert-warning">User not found:c</div>
                    )
                }

                    {( this.state.currentUser !== null && this.state.profileUsername === this.state.currentUser.username || this.props.isAdmin) && (
                        <Link to={"/add-review/" + this.state.profileUsername} className="nav-link">
                        Add some review
                        </Link>
                        )}
                <div>
                    <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
                </div>
            </div>
        );
    }
}
