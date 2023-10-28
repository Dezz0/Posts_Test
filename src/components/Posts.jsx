import React from "react";
import { useSelector } from "react-redux";
import { favorites, posts } from "../features/posts/postsSlice";
import styles from "../styles/posts.module.css";
import Post from "./Post";

export default function Posts() {
    const loadedPosts = useSelector(posts);
    const favoritesPosts = useSelector(favorites);
    const showFavorites = useSelector((state) => state.posts.showFavorites);
    const selectedName = useSelector((state) => state.posts.filterByName);

    const filterByFavorites = showFavorites
        ? loadedPosts.filter((post) => favoritesPosts.includes(post.id))
        : loadedPosts;

    const filterByName =
        selectedName !== "" ? filterByFavorites.filter((post) => post.author === selectedName) : filterByFavorites;
    return (
        <div className={styles.container}>
            {filterByName.map((post) => (
                <Post key={post.id} {...post} />
            ))}
        </div>
    );
}
