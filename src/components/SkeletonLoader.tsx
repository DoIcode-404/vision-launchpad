export const CardSkeleton = () => (
  <div className="card-elevated rounded-2xl p-6 animate-pulse">
    <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4" />
    <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
    <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4" />
    <div className="flex gap-4 justify-center">
      <div className="h-4 bg-muted rounded w-24" />
      <div className="h-4 bg-muted rounded w-24" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-muted rounded w-3/4" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-muted rounded w-1/2" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-muted rounded w-1/3" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-muted rounded w-2/3" />
    </td>
  </tr>
);
