using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BeautifyBaltics.ServiceDefaults.Middlewares
{
    public class DateOnlyJsonConverter : JsonConverter<DateOnly?>
    {
        private const string DateFormat = "yyyy-MM-dd";

        public override DateOnly? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.String) return null;

            var dateString = reader.GetString();

            // Try parsing as DateTime and return DateOnly part if successful
            if (DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var dateTime))
            {
                return DateOnly.FromDateTime(dateTime);
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, DateOnly? value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value?.ToString(DateFormat, CultureInfo.InvariantCulture));
        }
    }
}
