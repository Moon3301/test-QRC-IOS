using System.Text;

namespace Domain
{
	public static class String
	{
        private static readonly char[] separator = [' '];

        public static string Truncate(this string value, int words)
		{
			if (string.IsNullOrEmpty(value)) return value;
			string[] array = value.Split(separator, StringSplitOptions.RemoveEmptyEntries);
			return string.Join(" ", array.Take(words));
		}
		public static string Crop(this string str, int length)
		{
			length = (str.Length < length) ? str.Length : length;
			if (!string.IsNullOrEmpty(str))
			{
				str = str[..length];
			}
			return str;
		}

		public static string Cleanup(this string str, params string[] chars)
		{
			if (!string.IsNullOrEmpty(str))
			{
				foreach (var item in chars)
				{
					str = str.Replace(item, "");
				}
			}

			return str;
		}

		public static string ToValue(this string str)
		{
			if (!string.IsNullOrEmpty(str) && str.Equals("0"))
			{
				return str.Trim().Replace("0", "-");
			}
			return string.Empty;
		}

		public static string ToUrl(this string str)
		{
			if (!string.IsNullOrEmpty(str))
			{
				str = str.ToLower();
				//str = ReplaceSpanishCaharacters(str);
                StringBuilder sb = new (str.Length);
                foreach (char c in str.Trim())
                {
                    switch (c)
                    {
                        case ' ':
                            // Assuming previous character handling ensures no double spaces
                            sb.Append('-');
                            break;
                        case '\'':
                        case '\"':
                        case '?':
                        case '¿':
                        case '%':
                            // Skip these characters
                            break;
                        case '.':
                            sb.Append(',');
                            break;
                        case ':':
                            sb.Append(",,");
                            break;                      
                        default:
                            sb.Append(c);
                            break;
                    }
                }

                // Handle the double spaces to single space conversion separately, if needed
                // This is a more complex operation and might need a pre-processing step before the main loop
                // or a post-processing step after the loop, depending on specific requirements.

                return sb.ToString();
			}
			return string.Empty;
		}


        public static string FromUrl(this string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                StringBuilder sb = new(str.Length);
                for (int i = 0; i < str.Length; i++)
                {
                    char c = str[i];
                    switch (c)
                    {
                        case '-':
                            sb.Append(' ');
                            break;
                        case ',':
                            if (i + 1 < str.Length && str[i + 1] == ',')
                            {
                                sb.Append(':');
                                i++; // Skip the next comma
                            }
                            else
                            {
                                sb.Append('.');
                            }
                            break;
                        default:
                            sb.Append(c);
                            break;
                    }
                }

                string result = sb.ToString();
                return result;
            }
            return string.Empty;
        }

       


        private static string ReplaceSpanishCaharacters(string str)
		{
			return str.Replace("á", "a").Replace("é", "e").Replace("í", "i").Replace("ó", "o").Replace("ú", "u").Replace("ñ", "n").Replace("¿", "");
		}


	}

}
