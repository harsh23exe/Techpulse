import { NextResponse } from "next/server";
import { BlogGenerationService } from "@/services/BlogGenerationService";
import { posts } from "@/data/posts";
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    // Generate new posts
    const newPosts = await BlogGenerationService.generatePosts(3);
    
    // Combine with existing posts
    const updatedPosts = [...newPosts, ...posts];
    
    // Update the posts.ts file
    const postsContent = `import { Post } from "@/types";\n\nexport const posts: Post[] = ${JSON.stringify(updatedPosts, null, 2)};`;
    
    await fs.writeFile(
      path.join(process.cwd(), 'src', 'data', 'posts.ts'),
      postsContent,
      'utf-8'
    );

    return NextResponse.json({ 
      message: "Successfully generated new blog posts",
      count: newPosts.length 
    });
  } catch (error) {
    console.error('Error generating blog posts:', error);
    return NextResponse.json(
      { error: "Failed to generate blog posts" },
      { status: 500 }
    );
  }
}
