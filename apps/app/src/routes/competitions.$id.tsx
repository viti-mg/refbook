import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitions/$id')({
  component: CompetitionDetail,
})

function CompetitionDetail() {
  const { id } = Route.useParams()
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Competition Detail</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Competition {id}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          View and manage competition details.
        </p>
      </section>
    </main>
  )
}
