export function utilGetCookie(name: string) {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((cookie) => cookie.includes(`${name}=`));
  if (!cookie) {
    return null;
  }

  return cookie.split("=")[1];
}

export function utilSaveCookie(
  name: string,
  value: string,
  maxAge: number = 86400
) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function utilDeleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function utilFormatDateAndTime(
  locale: string,
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  }
) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function utilFormatCurrency(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(amount);
}
