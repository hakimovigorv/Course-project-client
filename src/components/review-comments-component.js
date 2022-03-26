import React, { Component } from "react";
import {API_BASE_URL} from "../constants";
import SockJsClient from 'react-stomp';
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import CommentService from "../services/comment.service";
import {Link} from "react-router-dom";
import Moment from "moment";
export default class ReviewCommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeCommentText = this.onChangeCommentText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sortCommentsByDate = this.sortCommentsByDate.bind(this);
        this.state = {
            content: "",
            currentUser: AuthService.getCurrentUser(),
            reviewId: null,
            commentText: "",
            comments: [],
        };
    }
    componentDidMount() {
        this.setState({
            reviewId: this.props.reviewId,
        })
        CommentService.getAllComments(this.props.reviewId).then(response => {
            this.setState({
                comments: response.data
            })
            this.sortCommentsByDate();
        });
    }

    sortCommentsByDate() {
        this.setState({
            comments: this.state.comments.sort((a, b) => {
                return  new Date(a.releaseDate) - new Date(b.releaseDate)
            })
        })
    }

    onChangeCommentText(e) {
        this.setState({
            commentText: e.target.value
        });
    }

    sendMessage() {
        try {
            this.clientRef.sendMessage('/app/comment', JSON.stringify({'reviewId': this.state.reviewId,
                'commentText': this.state.commentText,
                'authorName': this.state.currentUser.username
            }));
        } catch (e) {
            console.log("Sending error")
        }
        this.setState({
            commentText: ""
        })
    }

    onMessage(msg) {
        console.log(msg)
        this.setState({
            comments: [...this.state.comments, msg]
        })
        console.log(this.state.comments)
    }

    render() {
        const header = authHeader();
        return (
            <div>
                <SockJsClient url={API_BASE_URL + 'comment-websocket'} topics={['/topic/comment/' + this.state.reviewId]}
                              onMessage={this.onMessage}
                              onConnect={ () => { console.log("connected!") } }
                              ref={ (client) => { this.clientRef = client }}
                              headers = {header}
                              />
                {this.state.currentUser!==null ? (
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <input type="text" className="form-control me-3" placeholder="Add comment"
                               value={this.state.commentText}
                               onChange={this.onChangeCommentText}
                        />
                        <button className="btn btn-primary ms-2 d-flex justify-content-between align-bottom" type="button"
                                onClick={this.sendMessage}>
                            <span className="me-1">Comment</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-send mt-1" viewBox="0 0 16 16">
                                <path
                                    d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                            </svg>
                        </button>
                    </div>
                ):(
                    <div className="alert alert-warning">
                        <Link to={"/login"}>
                            Sign in
                        </Link>
                        {" "}to send comments.
                    </div>
                )}
                <div>
                    {this.state.comments.length!==0 ? (
                        this.state.comments.map((comment, index) =>
                        <div key={index} className="mt-2 mb-3 p-2  border border-light bg-gradient rounded shadow bg-light">
                            <span >
                                <Link
                                    to={`/profile/${comment.authorName}`}
                                    style={{textDecoration: 'none'}}
                                    className="link-dark font-weight-bold m-sm-2"
                                >
                                    {comment.authorImgUrl ? (
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
                                    {comment.authorName}
                                </Link>
                                {comment.releaseDate && (<span
                                    className="m-sm-2 fw-light">{Moment(comment.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}</span>)}
                            </span>
                            <div className="ms-3 mt-1">{comment.commentText}</div>
                        </div>
                        )):(
                            <div className="alert alert-light">
                                There are no comments yet:c
                            </div>
                    )}
                </div>
            </div>
        );
    }
}