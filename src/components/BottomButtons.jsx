import React from "react";
import styles from "../styles/buttomButtons.module.css";
import { useDispatch, useSelector } from "react-redux";
import { multipleAdditionFavorites, multipleDeletionPosts } from "../features/posts/postsSlice";

export default function BottomButtons() {
    const dispatch = useDispatch();
    const selectedPosts = useSelector((state) => state.posts.selectedPosts);

    function handleAddToFavorites() {
        if (window.confirm(`Want to add ${selectedPosts.length} posts to your favorites?`)) {
            dispatch(multipleAdditionFavorites(selectedPosts));
        }
    }
    function handleDeleteosts() {
        if (window.confirm(`Want to add ${selectedPosts.length} posts to your favorites?`)) {
            dispatch(multipleDeletionPosts(selectedPosts));
        }
    }

    return (
        <div className={selectedPosts.length === 0 ? styles.hiddenButtons : styles.bottomButtons}>
            <button className={styles.favoritesBtn} onClick={handleAddToFavorites}>
                To favorites ({selectedPosts.length})
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteosts}>
                Delete ({selectedPosts.length})
            </button>
        </div>
    );
}
