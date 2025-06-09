export async function fetchVAArtworks(
  searchTerm = "vinci",
  page = 1,
  orderParam = "desc"
) {
  const res = await fetch(
    `https://api.vam.ac.uk/v2/objects/search?q_object_title=${searchTerm}&page_size=10&page=${page}&order_by=date&order_sort=${orderParam}&images_exist=1`
  );

  return await res.json();
}

export async function fetchVAObject(id: string | undefined) {
  const res = await fetch(`https://api.vam.ac.uk/v2/museumobject/${id}`);

  return await res.json();
}
