using Microsoft.AspNetCore.Http;

namespace BeautifyBaltics.Integrations.BlobStorage
{
    public class BlobFileDTO(string fileName, byte[] content, string contentType)
    {
        public string FileName { get; } = fileName;
        public byte[] Content { get; } = content;
        public string ContentType { get; } = contentType;

        public BlobFileDTO(string fileName, Stream dataStream, string contentType)
            : this(fileName, ReadStream(dataStream), contentType)
        {
        }

        public BlobFileDTO(string fileName, IFormFile dataStream, string contentType)
            : this(fileName, ReadStream(dataStream.OpenReadStream()), contentType)
        {
        }

        private static byte[] ReadStream(Stream stream)
        {
            using var memoryStream = new MemoryStream();
            stream.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
    };
}
