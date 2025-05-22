import React, { useState } from 'react';
import styles from './TweetInput.module.css';
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice"
import { storage, db, auth } from "../firebase"
import { Avatar, Button, IconButton } from '@material-ui/core';
import firebase from "firebase/app";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput: React.FC = () => {
    const user = useSelector(selectUser);
    console.log("user.displayName:", user.displayName);
    const [tweetImage, setTweetImage] = useState<string | null>(null);
    const [tweetMsg, setTweetMsg] = useState("");
    const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTweetImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            e.target.value = ""; //reset input
        }
    };
    const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await db.collection("posts").add({
                avatar: user.photoUrl,
                image: tweetImage || "",
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
            });
            setTweetMsg("");
            setTweetImage(null);
        } catch (err) {
            alert("Error posting tweet: " + err);
        }
    };

    return (
        <>
            <form onSubmit={sendTweet}>
                <div className={styles.tweet_form}>
                    <Avatar
                        className={styles.tweet_avatar}
                        src={user.photoUrl}
                        onClick={async () => {
                            await auth.signOut();
                        }}
                    />
                    <input
                        className={styles.tweet_input}
                        placeholder="What's happening?"
                        type="text"
                        autoFocus
                        value={tweetMsg}
                        onChange={(e) => setTweetMsg(e.target.value)}
                    />
                    <IconButton>
                        <label>
                            <AddPhotoIcon
                                className={
                                    tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                                }
                            />
                            <input
                                className={styles.tweet_hiddenIcon}
                                type="file"
                                onChange={onChangeImageHandler}
                            />
                        </label>
                    </IconButton>
                </div>
                <Button
                    type="submit"
                    disabled={!tweetMsg}
                    className={
                        tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
                    }
                >
                    Tweet
                </Button>
            </form>
        </>
    )
}

export default TweetInput
