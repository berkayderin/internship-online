export function NoDataDisplay({ icon: Icon, message }) {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <div className="text-center">
        <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
