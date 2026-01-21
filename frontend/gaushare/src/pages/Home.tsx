import Card from '@/components/common/Card'
import StickyCardLayout from '../components/layouts/StickyCardLayout'
import { SkeletonCard } from '../components/ui/skeletons/card-skeleton'

export default function Home() {

    return (
        <StickyCardLayout>
            <p className="text-foreground">
                This card is positioned fixed with a top offset and has scrollable content.
                The content scrolls independently without affecting the BaseLayout.
            </p>

            <div className="space-y-3">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-md">
                        <h3 className="font-semibold mb-2">Section {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">
                            This is scrollable content inside the card.
                            The card has a fixed height and the content scrolls independently.
                        </p>
                    </div>
                ))}
            </div>
            <SkeletonCard />
            <Card
                variant="post"
                authorName="John Doe"
                authorUsername="johndoe"
                title="My First Post"
                description="This is a description of my post"
                image="/path/to/image.jpg"
                createdAt="2 hours ago"
                onClick={() => console.log('Post clicked')}
            />

            <Card
                variant="document"
                title="Project Proposal.pdf"
                description="Detailed proposal for the new project"
                fileType="PDF"
                fileSize="2.5 MB"
                createdAt="Yesterday"
                onClick={() => console.log('Document clicked')}
            />
        </StickyCardLayout>
    )
}
