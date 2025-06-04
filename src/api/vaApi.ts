// https://developers.vam.ac.uk/guide/v2/filter/introduction.html
export async function fetchVAArtworks() {
  const res = await fetch(
    "https://api.vam.ac.uk/v2/objects/search?q=vinci&images_exist=1",
  );
  return res.json();
}
