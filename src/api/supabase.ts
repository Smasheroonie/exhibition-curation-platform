import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type ArtworkData = {
  artwork_id: string;
  title: string;
  image_url: string;
};

export type Collection = {
  collection_id?: number;
  user_id: string;
  created_at?: string;
  collection_name: string;
};

export const getCollections = async (uid: string | undefined) => {
  try {
    const { data: collections, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", uid);

    if (error) {
      console.error("Error fetching collection:", error);
    }

    return collections;
  } catch (error) {
    console.error("Error fetching collection:", error);
  }
};

export const getArtworksByCollectionId = async (
  collection_id: string | undefined
) => {
  try {
    const { data, error } = await supabase
      .from("collections_artworks")
      .select("artworks(*)")
      .eq("collection_id", collection_id);

    if (error) {
      console.error("Error fetching artworks:", error.message);
      return null;
    }

    const artworks = data.map((item: any) => item.artworks);

    return artworks;
  } catch (error) {
    console.error("Error fetching artworks:", error);
  }
};

export const insertCollection = async (
  user_id: string,
  collection_name: string
) => {
  try {
    const { data: error } = await supabase
      .from("collections")
      .insert([{ user_id, collection_name }]);

    if (error) {
      console.error("Error creating collection:", error);
    }
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

export const insertArtworkIfNotExists = async (artworkData: ArtworkData) => {
  try {
    const { data: error } = await supabase
      .from("artworks")
      .upsert(artworkData, {
        onConflict: "artwork_id",
        ignoreDuplicates: true,
      });

    if (error) {
      console.error("Error inserting artwork:", error);
    }
  } catch (error) {
    console.error("Error inserting artwork:", error);
  }
};

export const insertArtworkIntoCollection = async (
  artwork_id: string,
  collection_id: number,
  user_id: string
) => {
  try {
    const { data: error } = await supabase
      .from("collections_artworks")
      .insert([{ artwork_id, collection_id, user_id }]);

    if (error) {
      console.error("Error creating collection:", error);
    }
  } catch (error) {
    console.error("Error inserting artwork:", error);
  }
};

export const deleteArtworkFromCollection = async (
  collection_id: string,
  artwork_id: string
) => {
  try {
    const { error } = await supabase
      .from("collections_artworks")
      .delete()
      .eq("collection_id", collection_id)
      .eq("artwork_id", artwork_id);

    if (error) {
      console.error("Error deleting artwork:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return false;
  }
};

export const deleteCollection = async (
  collection_id: number,
  user_id: string
) => {
  try {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("collection_id", collection_id)
      .eq("user_id", user_id);

    if (error) {
      console.error("Error deleting collection:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting collection:", error);
    return false;
  }
};
