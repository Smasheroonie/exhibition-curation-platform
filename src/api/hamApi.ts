const HAM_API_KEY = import.meta.env.VITE_HAM_KEY;

export async function fetchHAMArtworks() {
    const res = await fetch(
        `https://api.harvardartmuseums.org/object?apikey=${HAM_API_KEY}&size=20&q=imagepermissionlevel:0&hasimage=1&sort=createdate&sortorder=desc`,
    );
    return res.json();
}
