export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
};

export type ValidationProblemDetails = ProblemDetails & {
  errors?: { [key: string]: string[] } | null;
};
