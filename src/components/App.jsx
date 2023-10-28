import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import styles from "../styles/app.module.css";
import Posts from "./Posts";
import Header from "./Header";
import Footer from "./Footer";
import BottomButtons from "./BottomButtons";

export default function App() {
    const dispatch = useDispatch();
    const page = useSelector((state) => state.posts.page);
    const postsPerPage = useSelector((state) => state.posts.postsPerPage);

    useEffect(() => {
        dispatch(fetchPosts({ postPerPage: postsPerPage, page }));
    }, [dispatch, postsPerPage, page]);

    return (
        <div className={styles.container}>
            <Header />
            <Posts />
            <Footer />
            <BottomButtons />
        </div>
    );
}
