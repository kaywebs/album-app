const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'cover') {
            cb(null, 'Output/assets/');
        } else if (file.fieldname === 'audio') {
            cb(null, 'Output/assets/audio/');
        }
    },
    filename: function (req, file, cb) {
        // We will rename the audio file to match the slug later in the controller if needed,
        // but for now let's use the original name or a temp timestamp name to avoid collisions
        // The slug isn't available in 'req.body' inside destination/filename immediately in some multer configs depending on order,
        // generally it's safer to just save it and rename it after, or ensure text fields come first.
        // For simplicity, we'll keep original extension.
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/api/add-album', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res) => {
    try {
        const data = req.body;
        const files = req.files;

        if (!files.cover) {
            return res.status(400).send('Cover image is required');
        }

        const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        
        // Handle Audio File Renaming (needs to match slug for the player to work)
        let playingSongFilename = "";
        if (files.audio && files.audio[0]) {
            const audioFile = files.audio[0];
            const oldPath = audioFile.path;
            const extension = path.extname(audioFile.originalname);
            const newFilename = `${slug}${extension}`;
            const newPath = path.join('Output/assets/audio/', newFilename);
            
            // Rename file to [slug].mp3
            fs.renameSync(oldPath, newPath);
            // The script expects the MP3 to be at ./assets/audio/[slug].mp3, but doesn't store the path in the object.
            // It dynamically loads it: `currentAudio = new Audio(./assets/audio/${slug}.mp3);`
            // So we don't need to save the path in the JSON, just ensure the file exists.
        }

        // Prepare new album object
        const newAlbum = {
            id: Date.now(), // Simple unique ID
            slug: slug,
            title: data.title,
            artist: data.artist,
            cover: `./assets/${files.cover[0].filename}`,
            releaseDate: data.releaseDate,
            label: data.label,
            releaseNumber: data.releaseNumber,
            description: data.description,
            playingSong: data.playingSongTitle,
            credits: {
                "Producer": data.creditProducer,
                "Mixer": data.creditMixer,
                "Mastering Engineer": data.creditMastering,
                "Artist": data.creditArtist
            },
            artistLinks: {
                spotify: data.linkSpotify,
                appleMusic: data.linkApple,
                youtube: data.linkYoutube,
                bandcamp: data.linkBandcamp
            },
            tracks: JSON.parse(data.tracks || '[]')
        };

        // Write to Output/script.js
        const scriptPath = path.join(__dirname, 'Output/script.js');

        // OVERWRITE script.js with ONLY the new album object
        const albumString = JSON.stringify(newAlbum, null, 4);
        fs.writeFileSync(scriptPath, albumString, 'utf8');

        res.send('Album added! The file <code>Output/script.js</code> now contains the new album data. <a href="/admin">Go back</a>');

    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding album: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Admin app listening at http://localhost:${port}/admin`);
});
