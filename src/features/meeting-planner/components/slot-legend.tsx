/**
 * Legend component explaining slot colors
 */

export const SlotLegend = () => {
  return (
    <div className="flex flex-wrap gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-md bg-linear-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-500/30"></div>
        <span className="text-muted-foreground font-medium">All available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-md bg-linear-to-br from-amber-500 to-amber-600 shadow-sm shadow-amber-500/30"></div>
        <span className="text-muted-foreground font-medium">
          Some available
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-muted border-border/60 h-4 w-4 rounded-md border"></div>
        <span className="text-muted-foreground font-medium">
          None available
        </span>
      </div>
    </div>
  );
};
