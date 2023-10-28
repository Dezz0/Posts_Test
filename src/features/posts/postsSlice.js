import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    posts: JSON.parse(localStorage.getItem("posts")) || [],
    favorites: JSON.parse(localStorage.getItem("favorites")) || [],
    page: JSON.parse(localStorage.getItem("page")) || 1,
    postsPerPage: JSON.parse(localStorage.getItem("postsPerPage")) || 10,
    users: [],
    selectedPosts: [],
    filterByName: "",
    sortedBy: "",
    showFavorites: false,
    status: null,
    error: null
};

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async ({ postPerPage = 10, page = 1 }, { rejectWithValue }) => {
        try {
            const postsResponse = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_limit=${postPerPage}&_page=${page}`
            );
            const usersResponse = await fetch("https://jsonplaceholder.typicode.com/users");

            if (!postsResponse.ok || !usersResponse.ok) {
                throw new Error("Что-то пошло не так.");
            }

            const postsData = await postsResponse.json();
            const usersData = await usersResponse.json();

            return { postsData, usersData };
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const changePost = createAsyncThunk("posts/changePost", async ({ id, title, body, author }) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                author: author,
                id: id
            })
        });
        if (!response.ok) {
            throw new Error("Error when changing post");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error.message);
    }
});

export const removePost = createAsyncThunk("posts/removePost", async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Deletion error");
        }

        return { id };
    } catch (error) {
        console.log(error.message);
    }
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async ({ author, title, body }) => {
    try {
        const authorInfo = author.split("-");
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                author: authorInfo[0],
                body: body,
                userId: +authorInfo[1]
            })
        });
        if (!response.ok) {
            throw new Error("Error adding post");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error.message());
    }
});

export const multipleDeletionPosts = createAsyncThunk("posts/multipleDeletionPosts", async (selectedIds) => {
    const deletePromises = selectedIds.map((postId) => {
        return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "DELETE"
        });
    });
    try {
        const responses = await Promise.all(deletePromises);

        responses.forEach((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        });
        return selectedIds;
    } catch (error) {
        console.error("Error deleting posts:", error);
    }
});

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        multipleAdditionFavorites(state, action) {
            state.favorites = [...new Set([...state.favorites, ...action.payload])];
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
        addFavorites(state, action) {
            state.favorites.push(action.payload);
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
        removeFavorites(state, action) {
            state.favorites = state.favorites.filter((id) => id !== action.payload);
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
        chahgePostsPerPage(state, action) {
            state.postsPerPage = action.payload;
            state.page = 1;

            localStorage.setItem("postsPerPage", JSON.stringify(state.postsPerPage));
            localStorage.setItem("page", JSON.stringify(state.page));
        },
        changePageNumber(state, action) {
            state.page = action.payload;
            localStorage.setItem("page", JSON.stringify(state.page));
        },
        addPostToSelected(state, action) {
            state.selectedPosts.push(action.payload);
        },
        deletePostFromSelected(state, action) {
            const index = state.selectedPosts.indexOf(action.payload);
            state.selectedPosts.splice(index, 1);
        },
        changeVisibleFavorites(state) {
            state.showFavorites = !state.showFavorites;
        },
        changeFilterByName(state, action) {
            state.filterByName = action.payload;
        },
        sortedByParams(state, action) {
            switch (action.payload) {
                case "":
                    state.posts = JSON.parse(localStorage.getItem("posts"));
                    break;
                case "AuthorAsc":
                    state.posts = state.posts.sort((a, b) => a.author.localeCompare(b.author));
                    break;
                case "AuthorDesc":
                    state.posts = state.posts.sort((a, b) => b.author.localeCompare(a.author));
                    break;
                case "TitleAsc":
                    state.posts = state.posts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case "TitleDesc":
                    state.posts = state.posts.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case "FavoritesFirst":
                    let sortedArray = [];
                    let remainingArray = [];

                    state.favorites.forEach((id) => {
                        state.posts.forEach((post) => {
                            if (state.favorites.includes(post.id)) {
                                sortedArray.push(post);
                            }
                            remainingArray.push(post);
                        });
                    });

                    state.posts = [...new Set([...sortedArray, ...remainingArray])];
                    break;

                default:
                    break;
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "idle";
                const { postsData, usersData } = action.payload;
                let usersArray = new Set();

                usersData.forEach((user) => {
                    usersArray.add(user.name);
                    postsData.forEach((post) => {
                        if (user.id === post.userId) {
                            post.author = user.name;
                        }
                    });
                });
                state.users = [...usersArray];
                state.posts = postsData;
                localStorage.setItem("postsPerPage", JSON.stringify(state.postsPerPage));
                localStorage.setItem("posts", JSON.stringify(state.posts));
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.posts = JSON.parse(localStorage.getItem("posts") || []);
            })
            .addCase(changePost.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.posts = state.posts.map((post) => {
                    return post.id === id ? { ...action.payload } : post;
                });
                localStorage.setItem("posts", JSON.stringify(state.posts));
            })
            .addCase(removePost.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.posts = state.posts.filter((post) => post.id !== id);
                localStorage.setItem("posts", JSON.stringify(state.posts));
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.id = nanoid();
                state.posts = [action.payload, ...state.posts];
                localStorage.setItem("posts", JSON.stringify(state.posts));
            })
            .addCase(multipleDeletionPosts.fulfilled, (state, action) => {
                let posts = state.posts;

                action.payload.forEach((id) => {
                    posts = posts.filter((post) => post.id !== id);
                });
                state.posts = posts;

                state.selectedPosts = state.selectedPosts.filter((post) => !action.payload.includes(post));

                localStorage.setItem("posts", JSON.stringify(state.posts));
            });
    }
});

export const {
    addFavorites,
    removeFavorites,
    chahgePostsPerPage,
    changePageNumber,
    addPostToSelected,
    deletePostFromSelected,
    multipleAdditionFavorites,
    changeVisibleFavorites,
    changeFilterByName,
    sortedByParams
} = postsSlice.actions;

export const posts = (state) => state.posts.posts;
export const favorites = (state) => state.posts.favorites;

export default postsSlice.reducer;
