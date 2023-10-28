import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/filter.module.css";
import { changeFilterByName, changeVisibleFavorites, sortedByParams } from "../features/posts/postsSlice";

export default memo(function Filters() {
    const dispathc = useDispatch();
    const users = useSelector((state) => state.posts.users);
    const showFavorites = useSelector((state) => state.posts.showFavorites);
    const filterByName = useSelector((state) => state.posts.filterByName);

    function handleChangeVisibleFavorites() {
        dispathc(changeVisibleFavorites());
    }
    function handleChangeFilterByName(e) {
        dispathc(changeFilterByName(e.target.value));
    }
    function handleSortByParams(e) {
        dispathc(sortedByParams(e.target.value));
    }

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.favorites}>
                <label className={showFavorites ? styles.isActiveBtn : styles.disabledBtn} htmlFor="favorites">
                    {showFavorites ? "Hide favorites" : "Show favorites"}
                </label>
                <input type="checkbox" id="favorites" checked={showFavorites} onChange={handleChangeVisibleFavorites} />
            </div>

            <div className={styles.filterByName}>
                <label>Filter by name:</label>
                <select value={filterByName} onChange={handleChangeFilterByName}>
                    <option value="">default</option>
                    {users.map((user, userId) => (
                        <option value={user} key={userId}>
                            {user}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.sortContainer}>
                <label>Sorted by:</label>
                <select onChange={handleSortByParams}>
                    <option value="">default</option>
                    <option value="AuthorAsc">author asc</option>
                    <option value="AuthorDesc">author desc</option>
                    <option value="TitleAsc">title asc</option>
                    <option value="TitleDesc">title desc</option>
                    <option value="FavoritesFirst">favorites first</option>
                </select>
            </div>
        </div>
    );
});
