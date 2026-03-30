import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase client dengan env variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Ambil file dari form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diupload" },
        { status: 400 }
      );
    }

    // Batasi ukuran file (misal 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Buat nama file unik untuk menghindari overwrite
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
     .toString(36)
     .substring(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Upload ke bucket listing-images
    const { error: uploadError } = await supabase.storage
     .from("listing-images")
     .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Gagal upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Ambil URL publik
    const { data: publicUrlData } = supabase.storage
     .from("listing-images")
     .getPublicUrl(filePath);

    return NextResponse.json(
      {
        message: "Upload berhasil",
        url: publicUrlData.publicUrl,
        path: filePath,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error upload:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}