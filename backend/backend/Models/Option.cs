using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Option
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public bool IsCorrect { get; set; }

        [Required]
        [ForeignKey(nameof(QuestionId))]
        public int QuestionId { get; set; }
        [JsonIgnore]

        public virtual Question? Question { get; set; }
    }
}
