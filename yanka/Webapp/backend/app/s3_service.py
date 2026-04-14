import boto3
import os
import uuid
from datetime import datetime, timedelta
from botocore.exceptions import ClientError
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class S3Service:
    """
    Service for handling S3 operations for video and file storage.
    """

    def __init__(self):
        """Initialize S3 client with credentials from environment variables."""
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
        )
        self.bucket_name = os.getenv('S3_BUCKET_NAME')

        if not self.bucket_name:
            logger.warning("S3_BUCKET_NAME environment variable not set - S3 functionality will be disabled")
            raise ValueError("S3_BUCKET_NAME environment variable is required")

    def upload_video(self, video_data: bytes, user_id: int, content_type: str = "video/mp4") -> Optional[str]:
        """
        Upload a video file to S3 and return the S3 URL.

        Args:
            video_data: Raw video file data
            user_id: ID of the user who owns this video
            content_type: MIME type of the video file

        Returns:
            S3 URL of the uploaded video, or None if upload failed
        """
        try:
            # Generate unique filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            file_key = f"videos/user_{user_id}/{timestamp}_{unique_id}.mp4"

            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=video_data,
                ContentType=content_type,
                Metadata={
                    'user_id': str(user_id),
                    'upload_time': datetime.now().isoformat()
                }
            )

            # Return S3 URL
            s3_url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_DEFAULT_REGION', 'us-east-1')}.amazonaws.com/{file_key}"
            logger.info(f"Successfully uploaded video to S3: {s3_url}")
            return s3_url

        except ClientError as e:
            logger.error(f"Failed to upload video to S3: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error uploading video: {e}")
            return None

    def upload_file(self, file_data: bytes, user_id: int, filename: str, content_type: str) -> Optional[str]:
        """
        Upload any file to S3 and return the S3 URL.

        Args:
            file_data: Raw file data
            user_id: ID of the user who owns this file
            filename: Original filename
            content_type: MIME type of the file

        Returns:
            S3 URL of the uploaded file, or None if upload failed
        """
        try:
            # Generate unique filename while preserving extension
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            file_extension = filename.split('.')[-1] if '.' in filename else ''
            safe_filename = filename.replace(' ', '_').replace('/', '_')
            file_key = f"files/user_{user_id}/{timestamp}_{unique_id}_{safe_filename}"

            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data,
                ContentType=content_type,
                Metadata={
                    'user_id': str(user_id),
                    'original_filename': filename,
                    'upload_time': datetime.now().isoformat()
                }
            )

            # Return S3 URL
            s3_url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_DEFAULT_REGION', 'us-east-1')}.amazonaws.com/{file_key}"
            logger.info(f"Successfully uploaded file to S3: {s3_url}")
            return s3_url

        except ClientError as e:
            logger.error(f"Failed to upload file to S3: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error uploading file: {e}")
            return None

    def generate_presigned_url(self, s3_url: str, expiration: int = 3600) -> Optional[str]:
        """
        Generate a pre-signed URL for secure access to S3 objects.

        Args:
            s3_url: Full S3 URL of the object
            expiration: URL expiration time in seconds (default 1 hour)

        Returns:
            Pre-signed URL or None if generation failed
        """
        try:
            # Extract key from S3 URL
            if self.bucket_name in s3_url:
                file_key = s3_url.split(f"{self.bucket_name}.s3")[1].split('amazonaws.com/')[-1]
            else:
                logger.error(f"Invalid S3 URL format: {s3_url}")
                return None

            # Generate pre-signed URL
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_key},
                ExpiresIn=expiration
            )

            return presigned_url

        except ClientError as e:
            logger.error(f"Failed to generate pre-signed URL: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error generating pre-signed URL: {e}")
            return None

    def delete_file(self, s3_url: str) -> bool:
        """
        Delete a file from S3.

        Args:
            s3_url: Full S3 URL of the object to delete

        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            # Extract key from S3 URL
            if self.bucket_name in s3_url:
                file_key = s3_url.split(f"{self.bucket_name}.s3")[1].split('amazonaws.com/')[-1]
            else:
                logger.error(f"Invalid S3 URL format: {s3_url}")
                return False

            # Delete from S3
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)
            logger.info(f"Successfully deleted file from S3: {s3_url}")
            return True

        except ClientError as e:
            logger.error(f"Failed to delete file from S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting file: {e}")
            return False

    def list_user_files(self, user_id: int, file_type: str = "videos") -> list:
        """
        List all files for a specific user.

        Args:
            user_id: ID of the user
            file_type: Type of files to list ("videos" or "files")

        Returns:
            List of file information dictionaries
        """
        try:
            prefix = f"{file_type}/user_{user_id}/"

            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )

            files = []
            for obj in response.get('Contents', []):
                file_info = {
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'],
                    'url': f"https://{self.bucket_name}.s3.{os.getenv('AWS_DEFAULT_REGION', 'us-east-1')}.amazonaws.com/{obj['Key']}"
                }
                files.append(file_info)

            return files

        except ClientError as e:
            logger.error(f"Failed to list user files: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error listing files: {e}")
            return []


# Global instance - optional S3 setup
s3_service = None
try:
    s3_service = S3Service()
    logger.info("S3 service initialized successfully")
except Exception as e:
    logger.warning(f"S3 service not available: {e}")
    s3_service = None