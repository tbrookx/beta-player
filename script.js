async function loadPlaylist() {
  const repo = "tbrookx/beta-player";   // your repo
  const branch = "main";                 // change if your default branch differs
  const apiUrl = `https://api.github.com/repos/${repo}/contents/music?ref=${branch}`;

  const audio = document.getElementById("audioPlayer");
  const list  = document.getElementById("playlist");
  list.innerHTML = "Loading…";

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`GitHub API: ${res.status} ${res.statusText}`);
    const files = await res.json();

    // Keep only real files with .mp3/.wav (case-insensitive)
    const tracks = (Array.isArray(files) ? files : [])
      .filter(f => f.type === "file" && /\.(mp3|wav)$/i.test(f.name))
      .map(f => ({
        title: f.name.replace(/\.(mp3|wav)$/i, ""),
        url:   f.download_url
      }))
      .sort((a,b) => a.title.localeCompare(b.title, undefined, {numeric:true, sensitivity:"base"}));

    if (tracks.length === 0) {
      list.innerHTML = "<li>No audio files found in /music</li>";
      return;
    }

    // Build UI
    list.innerHTML = "";
    let current = null;

    function playIndex(i) {
      if (current !== null) list.children[current]?.classList.remove("playing");
      current = i;
      const li = list.children[i];
      li.classList.add("playing");
      audio.src = tracks[i].url;
      audio.play().catch(err => console.warn("Playback blocked until user interaction:", err));
      li.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    tracks.forEach((t, i) => {
      const li = document.createElement("li");
      li.textContent = t.title;
      li.addEventListener("click", () => playIndex(i));
      list.appendChild(li);
    });

    // Don’t auto-play (browsers block it); just select first source
    audio.src = tracks[0].url;
    list.children[0].classList.add("playing");

    // Auto-advance
    audio.addEventListener("ended", () => {
      if (current === null) return;
      const next = current + 1;
      if (next < tracks.length) playIndex(next);
      // or loop: else playIndex(0);
    });

  } catch (e) {
    console.error(e);
    list.innerHTML = `<li style="color:red">Couldn’t load playlist (see console)</li>`;
  }
}

// run on load
document.addEventListener("DOMContentLoaded", loadPlaylist);
