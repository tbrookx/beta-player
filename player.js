async function loadPlaylist() {
  const repo = "tbrookx/betap-layer"; // replace with your GitHub username/repo
  const branch = "main"; // or 'master'
  const apiUrl = `https://api.github.com/repos/${repo}/contents/music?ref=${branch}`;
  const response = await fetch(apiUrl);
  const files = await response.json();
  const tracks = files.filter(f => f.name.endsWith(".mp3")).map(f => ({title:f.name.replace(".mp3",""), url:f.download_url}));
  const audio = document.getElementById('audioPlayer');
  const list = document.getElementById('playlist');
  tracks.forEach(track => {
    const li = document.createElement('li');
    li.textContent = track.title;
    li.addEventListener('click',()=>{audio.src=track.url; audio.play();});
    list.appendChild(li);
  });
}
