async function loadPlaylist() {
  const repo = "tbrookx/beta-player"; // your GitHub username/repo
  const branch = "main"; // or 'master'
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

    let currentPlayingIndex = null;

    tracks.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = track.title;

      li.addEventListener("click", () => {
        playTrack(index);
      });

      list.appendChild(li);
    });

    function playTrack(index) {
      audio.src = tracks[index].url;
      audio.play().catch(err => console.error("Playback error:", err));

      // Remove previous highlight
      if (currentPlayingIndex !== null) {
        list.children[currentPlayingIndex].classList.remove("playing");
      }

      // Highlight current track
      list.children[index].classList.add("playing");
      currentPlayingIndex = index;

      // Auto-scroll to make the track visible
      list.children[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Auto-advance when track ends
    audio.addEventListener("ended", () => {
      if (currentPlayingIndex !== null && currentPlayingIndex < tracks.length - 1) {
        playTrack(currentPlayingIndex + 1);
      } else {
        // Optional: loop back to first track
        // playTrack(0);
      }
    });

  } catch (err) {
    console.error("Error loading playlist:", err);
    const status = document.getElementById("playlist");
    if (status) status.innerHTML = `<li style="color:red;">Error loading playlist. Check console for details.</li>`;
  }
}
