export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-serif text-4xl mb-2">Canvas Editor</h1>
      <p className="text-bloom-black/60 text-sm">Coming soon — editing post {params.id}.</p>
    </div>
  );
}
