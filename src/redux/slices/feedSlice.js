import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postsSlice";

export const getFeedData = createAsyncThunk(
    "user/getFeedData",
    async (body) => {
        try {            
            const response = await axiosClient.get("/user/getFeedData", body);
            console.log("userProfile => ", response.result);
            return response.result;
        } catch (error) {
            return Promise.reject(error);            
        }
    }
);

 export const followAndUnfollowUser = createAsyncThunk(
    'user/followAndUnfollow', 
    async(body, thunkAPI) => {
        try {
            const response = await axiosClient.post("/user/follow", body);
            return response.result.user;
            
        } catch (error) {
            return Promise.reject(error);            
        }
 })


const feedSlice = createSlice({
    name: "feedSlice",
    initialState: {
        feedData: {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeedData.fulfilled, (state, action) => {
                state.feedData = action.payload;
            })
            .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
                const post = action.payload; 

                const index = state?.feedData?.posts?.findIndex(item => item._id ===post._id);
                console.log("feed like", post, index);
                if(index != undefined && index != -1){
                    state.feedData.posts[index] = post;
                }
            })
            .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
                const user = action.payload;
                const index = state?.feedData?.followings.findIndex(item => item._id == user._id);
                if(index != -1) {
                    state?.feedData.followings.splice(index, 1);
                } else {
                    state?.feedData.followings.push(user);
                } 
            })
    },
});


export default feedSlice.reducer;