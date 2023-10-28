import React from "react";
import styles from "../styles/comment.module.css";

export default function Comment({ comments, author }) {
    return (
        <div className={styles.comments}>
            <p className={styles.commentsTitle}>Comments: </p>
            {comments.length !== 0
                ? comments.map((comment) => (
                      <div className={styles.comment} key={comment.id}>
                          <p className={styles.authorComment}>{author}</p>
                          <p className={styles.email}>{comment.email}</p>
                          <p className={styles.content}>{comment.body}</p>
                      </div>
                  ))
                : "No comments found"}
        </div>
    );
}
