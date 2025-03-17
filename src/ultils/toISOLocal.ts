export function toISOLocal(d: any) {
    const z = (n: any) => ('0' + n).slice(-2);
    let off = d.getTimezoneOffset();
    const sign = off < 0 ? '+' : '-';
    off = Math.abs(off);
    return (
      new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1) +
      'Z'  // Thay '+07:00' hoặc múi giờ khác thành 'Z'
    );
  }
  