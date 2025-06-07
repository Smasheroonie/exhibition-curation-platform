const HAM_API_KEY = import.meta.env.VITE_HAM_KEY;

export async function fetchHAMArtworks(
  searchTerm = "vinci",
  page = 1,
  orderParam = "desc"
) {
  const res = await fetch(
    `https://api.harvardartmuseums.org/object?apikey=${HAM_API_KEY}&title=${searchTerm}&size=10&q=imagepermissionlevel:0&hasimage=1&sort=datebegin&sortorder=${orderParam}&page=${page}`
  );

  return await res.json();
}

export async function fetchHAMObject(id: number) {
  const res = await fetch(
    `https://api.harvardartmuseums.org/object/${id}?apikey=${HAM_API_KEY}`
  );

  return await res.json();
}
