// SkeletonItem.tsx
import React from "react"
import { IonItem, IonThumbnail, IonLabel, IonSkeletonText } from "@ionic/react"

interface SkeletonItemProps {
  width1: string
  width2: string
  width3: string
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width1,
  width2,
  width3,
}) => (
  <IonItem>
    <IonThumbnail slot="start">
      <IonSkeletonText animated={true} />
    </IonThumbnail>
    <IonLabel>
      <h3>
        <IonSkeletonText animated={true} style={{ width: width1 }} />
      </h3>
      <p>
        <IonSkeletonText animated={true} style={{ width: width2 }} />
      </p>
      <p>
        <IonSkeletonText animated={true} style={{ width: width3 }} />
      </p>
    </IonLabel>
  </IonItem>
)

export default SkeletonItem
