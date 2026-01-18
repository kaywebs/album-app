# Album Manager Web App

This simple Node.js application allows you to easily add new albums to your website via a user-friendly graphical interface. It handles uploading cover images and audio files, automatically renaming them, and generating the necessary JSON data for your website.

## Features

-   **Web-based Admin Interface**: No need to edit JSON files manually.
-   **File Management**: Uploads cover art and audio files (mp3).
-   **Auto-Formatting**: Automatically renames audio files to match the album slug.
-   **Output Generation**: Creates a `script.js` file with the JSON object ready to be pasted into your main website code.

## Prerequisites

-   [Node.js](https://nodejs.org/) installed on your computer.

## Installation

1.  Open your terminal in this folder.
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Usage

### 1. Start the Server
Run the following command in your terminal:
```bash
npm start
```
You will see a message: `Admin app listening at http://localhost:3000/admin`

### 2. Add an Album
1.  Open your web browser and go to [http://localhost:3000/admin](http://localhost:3000/admin).
2.  Fill in the album details (Title, Release Date, Credits, etc.).
3.  Upload the **Cover Image** and **Featured Song Audio**.
4.  Add your tracks one by one using the "+ Add Track" button.
5.  Click **"Add Album"**.

### 3. Retrieve Your Data
After submitting the form, navigate to the `Output` folder in this directory.

-   **`Output/script.js`**: Contains the JSON code for the album you just added. Open this file, copy the content, and paste it into your main website's data file.
-   **`Output/assets/`**: Contains uploaded cover images.
-   **`Output/assets/audio/`**: Contains the renamed audio files (e.g., `album-slug.mp3`).

Move the images and audio files to your website's assets folder.

## Stopping the Server
To stop the server, go to your terminal window and press `Ctrl + C`.
