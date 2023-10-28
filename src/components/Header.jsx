import React, { useState } from "react";
import styles from "../styles/header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, chahgePostsPerPage } from "../features/posts/postsSlice";
import Filters from "./Filters";

export default function Header() {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.posts.users);
    const postsPerPage = useSelector((state) => state.posts.postsPerPage);
    const [isAdding, setIsAdding] = useState(false);
    const [author, setAuthor] = useState(users[0]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    function handleChangeVisibleForm(e) {
        setIsAdding(!isAdding);
        if (isAdding) {
            setAuthor(users[0]);
            setTitle("");
            setBody("");
        }
    }

    function handleClick() {
        dispatch(addNewPost({ author, title, body }));
        setIsAdding(false);
        setAuthor(users[0]);
        setTitle("");
        setBody("");
    }

    function handleChangeCountPost(e) {
        dispatch(chahgePostsPerPage(e.target.value));
    }

    return (
        <div className={styles.center}>
            <Filters />
            <div className={styles.padding}>
                <div className={styles.leftSide}>
                    <label>Number of posts per page:</label>
                    <select value={postsPerPage} onChange={handleChangeCountPost}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="9999">All</option>
                    </select>
                </div>
            </div>
            <div className={styles.padding}>
                <p className={styles.newPostBtn} onClick={handleChangeVisibleForm}>
                    {isAdding ? "Close new post" : "➕ Add new post"}
                </p>
            </div>

            {isAdding && (
                <div className={styles.newPostFrom}>
                    <label>Name:</label>
                    <select className={styles.authorPost} value={author} onChange={(e) => setAuthor(e.target.value)}>
                        {users.map((user, userId) => (
                            <option value={`${user}-${userId + 1}`} key={userId}>
                                {user}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="titlePost">Title:</label>
                    <input
                        className={styles.titlePost}
                        type="text"
                        id="titlePost"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="bodyPost">Post content:</label>
                    <textarea
                        className={styles.bodyPost}
                        id="bodyPost"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    <button className={styles.addPost} onClick={handleClick}>
                        Add new post
                    </button>
                </div>
            )}
        </div>
    );
}
