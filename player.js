async function loadPlaylist() {
  const repo = "tbrookx/beta-player"; 
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/music?ref=${branch}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);

    const files = await response.json();
    if (!Array.isArray(files)) throw new Error("GitHub API did not return a file list.");

    const tracks = files
      .filter(f => f.name.endsWith(".mp3"))
      .map(f => ({ title: f.name.replace(".mp3", ""), url: f.download_url }));

    if (tracks.length === 0) {
      console.warn("No MP3 files found in /music folder.");
    }

    const audio = document.getElementById("audioPlayer");
    const list = document.getElementById("playlist");
    list.innerHTML = ""; // clear old list

    let currentPlayingLi = null;

    tracks.forEach(track => {
      const li = document.createElement("li");
      li.textContent = track.title;

      li.addEventListener("click", () => {
        audio.src = track.url;
        audio.play().catch(err => console.error("Playback error:", err));

        // Remove highlight from previous track
        if (currentPlayingLi) currentPlayingLi.classList.remove("playing");
        // Highlight current track
        li.classList.add("playing");
        currentPlayingLi = li;
      });

      list.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading playlist:", err);
    const status = document.getElementById("playlist");
    if (status) status.innerHTML = `<li style="color:red;">Error loading playlist. Check console for details.</li>`;
  }
}
