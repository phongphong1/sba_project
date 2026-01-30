import PostCard from '@/components/common/PostCard'
import DocumentCard from '@/components/common/DocumentCard'
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
            <PostCard
                authorName="John Doe"
                authorUsername="johndoe"
                title="My First Post"
                content="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lo"
                postUrl="/posts/123"
                createdAt="2 hours ago"
                onClick={() => console.log('Post clicked')}
            />

            <DocumentCard
                title="Project Proposal.pdf"
                slug="project-proposal"
                viewCount={100}
                downloadCount={50}
                isVip={false}
                fileType="PDF"
                fileSize="2.5 MB"
                createdAt="Yesterday"
                onClick={() => console.log('Document clicked')}
            />
        </StickyCardLayout>
    )
}
