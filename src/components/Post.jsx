import React, { useState } from "react";
import styles from "../styles/post.module.css";
import { Edit, Star, Trash } from "./Icons";
import Comment from "./Comments";
import { addPostToSelected, changePost, deletePostFromSelected } from "../features/posts/postsSlice";
import { useDispatch } from "react-redux";

export default function Post(props) {
    const dispatch = useDispatch();
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [setselected, setSetselected] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    const [author, setAuthor] = useState(props.author);

    async function fetchComments() {
        setShowComments(!showComments);
        if (!error && !comments.length) {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${props.id}`);
                if (!response.ok) {
                    throw new Error("No comments found");
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                setError(error.message);
            }
        }
    }

    function handleChangePost(id) {
        setIsEdit(!isEdit);
        if (isEdit) {
            let confirmChange = window.confirm("confirm changes");
            if (confirmChange) {
                dispatch(changePost({ id, title, body, author }));
            } else {
                setTitle(props.title);
                setBody(props.body);
                setAuthor(props.author);
            }
        }
    }

    function handleSelectPost(id) {
        setSetselected(!setselected);
        if (!setselected) {
            dispatch(addPostToSelected(id));
        } else {
            dispatch(deletePostFromSelected(id));
        }
    }

    return (
        <div className={styles.postContainer}>
            <div className={styles.post}>
                <div className={styles.headerPost}>
                    <input
                        className={styles.selectField}
                        type="checkbox"
                        checked={setselected}
                        onChange={() => handleSelectPost(props.id)}
                    />

                    {isEdit ? (
                        <input
                            type="text"
                            className={styles.titleField}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    ) : (
                        <p className={styles.title}>{props.title}</p>
                    )}

                    <div className={styles.headerIcons}>
                        <Edit handleChangePost={handleChangePost} id={props.id} />
                        <Trash id={props.id} />
                    </div>
                </div>
                {isEdit ? (
                    <textarea className={styles.bodyField} value={body} onChange={(e) => setBody(e.target.value)} />
                ) : (
                    <p className={styles.body}>{props.body}</p>
                )}

                <div className={styles.postBottom}>
                    <p className={styles.showButton} onClick={fetchComments}>
                        {!showComments ? "Show comments ▽" : "Hide comments △"}
                    </p>
                    {isEdit ? (
                        <input
                            type="text"
                            className={styles.authorField}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    ) : (
                        <p className={styles.author}>{props.author}</p>
                    )}

                    <Star id={props.id} />
                </div>
            </div>

            {showComments ? <Comment comments={comments} author={props.author} /> : ""}
        </div>
    );
}
