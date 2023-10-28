import React from "react";
import styles from "../styles/footer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { changePageNumber } from "../features/posts/postsSlice";

export default function Footer({ setPage }) {
    const dispatch = useDispatch();
    const postsPerPage = useSelector((state) => state.posts.postsPerPage);

    function handleClick(page) {
        dispatch(changePageNumber(page));
    }

    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = 1; i <= 100 / postsPerPage; i++) {
            pageNumbers.push(
                <p className={styles.pageNumber} key={i} onClick={() => handleClick(i)}>
                    {i}
                </p>
            );
        }
        return pageNumbers;
    };
    return <div className={styles.center}>{renderPageNumbers()}</div>;
}
